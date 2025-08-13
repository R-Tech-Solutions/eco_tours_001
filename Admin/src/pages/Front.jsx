import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BackendUrl } from '../Backendurl'
import './Front.css'


const Front = () => {
  const [formData, setFormData] = useState({
    id: null,
    logo_image: null,
    logo_text: '',
    heading: '',
    subheading: '',
    paragraph: '',
    company_logo: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [savedData, setSavedData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [logoBust, setLogoBust] = useState(0) // cache-buster for current logo

  // Load data from API on component mount
  useEffect(() => {
    fetchFrontData();
  }, []);

  const fetchFrontData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${BackendUrl}/api/front/`)
      setSavedData(response.data)
    } catch (error) {
      console.error('Error fetching front data:', error)
      let errorMsg = 'Failed to load data from server';
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else {
          errorMsg = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, logo_image: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCompanyLogoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, company_logo: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setCompanyLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Test function for debugging company logo
  const handleCompanyLogoUpload = async () => {
    if (!formData.company_logo) {
      alert('Please select a company logo first');
      return;
    }
    
    try {
      setLoading(true);
      console.log('=== COMPANY LOGO UPLOAD DEBUG ===');
      console.log('1. File selected:', formData.company_logo);
      console.log('2. File name:', formData.company_logo.name);
      console.log('3. File size:', formData.company_logo.size);
      console.log('4. File type:', formData.company_logo.type);
      console.log('5. Saved data length:', savedData.length);

      // Determine best target record to update so Current Company Logo updates immediately
      const highestIdRecord = [...savedData].sort((a, b) => (b.id || 0) - (a.id || 0))[0];
      const recordWithCompanyLogo = savedData
        .filter(item => item && item.company_logo)
        .sort((a, b) => (b.id || 0) - (a.id || 0))[0];
      const targetRecord = recordWithCompanyLogo || highestIdRecord || null;

      if (targetRecord) {
        // Update chosen Front record with company logo
        console.log('6. Updating record with ID:', targetRecord.id);
        console.log('7. Current record data:', targetRecord);
        
        const logoForm = new FormData();
        logoForm.append('company_logo', formData.company_logo);
        
        console.log('8. FormData created with company_logo');
        console.log('9. FormData entries:');
        for (let [key, value] of logoForm.entries()) {
          console.log(`   ${key}:`, value);
        }
        
        console.log('10. Making PUT request to:', `${BackendUrl}/api/front/${targetRecord.id}/update/`);
        const response = await axios.put(`${BackendUrl}/api/front/${targetRecord.id}/update/`, logoForm, { 
          headers: { 'Content-Type': 'multipart/form-data' } 
        });
        
        console.log('11. Response received:', response.data);
        console.log('12. Company logo updated successfully!');
        alert('Company logo updated successfully!');
      } else {
        // Create new Front record with company logo
        console.log('6. Creating new record for company logo');
        
        const logoForm = new FormData();
        logoForm.append('company_logo', formData.company_logo);
        logoForm.append('heading', 'Company Logo Record');
        logoForm.append('subheading', 'Auto-generated for company logo');
        logoForm.append('paragraph', 'This record was created to store the company logo.');
        
        console.log('7. FormData created with all fields');
        console.log('8. FormData entries:');
        for (let [key, value] of logoForm.entries()) {
          console.log(`   ${key}:`, value);
        }
        
        console.log('9. Making POST request to:', `${BackendUrl}/api/front/create/`);
        const response = await axios.post(`${BackendUrl}/api/front/create/`, logoForm, { 
          headers: { 'Content-Type': 'multipart/form-data' } 
        });
        
        console.log('10. Response received:', response.data);
        console.log('11. Company logo record created successfully!');
        alert('Company logo uploaded successfully!');
      }
      
      // Reset form and refresh data
      console.log('13. Resetting form and refreshing data...');
      setFormData(prev => ({ ...prev, company_logo: null }));
      setCompanyLogoPreview(null);
      await fetchFrontData();
      setLogoBust(prev => prev + 1);
      console.log('14. Data refreshed, upload complete!');
      
    } catch (error) {
      console.error('=== COMPANY LOGO UPLOAD ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      
      alert('Failed to upload company logo: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      console.log('15. Loading state reset');
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      setLoading(true)
      setError(null)

      const formDataToSend = new FormData()
      formDataToSend.append('logo_text', formData.logo_text)
      formDataToSend.append('heading', formData.heading)
      formDataToSend.append('subheading', formData.subheading)
      formDataToSend.append('paragraph', formData.paragraph)
      
      // Handle logo_image file upload properly
      if (formData.logo_image) {
        formDataToSend.append('logo_image', formData.logo_image)
        console.log('Logo image appended:', formData.logo_image.name)
      }

      // Debug: Log all form data
      console.log('Form data being sent:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value)
      }

      if (isEditing) {
        // Update existing data
        console.log('Updating existing record with ID:', formData.id)
        const response = await axios.put(`${BackendUrl}/api/front/${formData.id}/update/`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Update response:', response.data)
        alert('Content updated successfully!')
      } else {
        // Create new data
        console.log('Creating new record')
        const response = await axios.post(`${BackendUrl}/api/front/create/`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Create response:', response.data)
        alert('Content saved successfully!')
      }

      // Refresh data and reset form
      await fetchFrontData()
      resetForm()
    } catch (error) {
      console.error('Error saving data:', error)
      console.error('Error response:', error.response?.data)
      setError(error.response?.data?.message || 'Failed to save data')
      alert('Error: ' + (error.response?.data?.message || 'Failed to save data'))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      logo_image: null, // Keep as null to allow new file selection
      logo_text: item.logo_text || '',
      heading: item.heading,
      subheading: item.subheading,
      paragraph: item.paragraph,
      company_logo: null
    })
    setImagePreview(item.logo_image ? `${BackendUrl}${item.logo_image}` : null)
    setCompanyLogoPreview(item.company_logo ? `${BackendUrl}${item.company_logo}` : null)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        setLoading(true)
        setError(null)
        await axios.delete(`${BackendUrl}/api/front/${id}/delete/`)
        alert('Content deleted successfully!')
        await fetchFrontData()
      } catch (error) {
        console.error('Error deleting data:', error)
        setError(error.response?.data?.message || 'Failed to delete data')
        alert('Error: ' + (error.response?.data?.message || 'Failed to delete data'))
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      id: null,
      logo_image: null,
      logo_text: '',
      heading: '',
      subheading: '',
      paragraph: '',
      company_logo: null
    });
    setImagePreview(null);
    setCompanyLogoPreview(null);
    setIsEditing(false);
    setError(null);
  }

  // Get the logo image from the highest-id record with company_logo (fallback to highest-id logo_image), with cache-buster
  const highestIdRecord = [...savedData].sort((a, b) => (b.id || 0) - (a.id || 0))[0];
  const recordWithCompanyLogo = savedData
    .filter(item => item && item.company_logo)
    .sort((a, b) => (b.id || 0) - (a.id || 0))[0];
  let companyLogo = "/travel-logo.png";
  let companyLogoFilename = null;
  if (recordWithCompanyLogo && recordWithCompanyLogo.company_logo) {
    companyLogo = `${BackendUrl}${recordWithCompanyLogo.company_logo}?t=${logoBust}`;
    companyLogoFilename = recordWithCompanyLogo.company_logo.split('/').pop();
  } else if (highestIdRecord?.logo_image) {
    companyLogo = `${BackendUrl}${highestIdRecord.logo_image}?t=${logoBust}`;
    companyLogoFilename = highestIdRecord.logo_image.split('/').pop();
  }

  return (
    <div className="front-container">
      {/* Logo Section - Dynamic from backend, fallback if error */}
      <div className="logo-section">
        <div className="logo">
          <img src={companyLogo} alt="Eco Travels Logo" className="logo-image" onError={e => { e.target.onerror = null; e.target.src = "/travel-logo.png"; }} />
          <h1 className="logo-text">Eco Travels</h1>
        </div>
        <div className="logo-info">
          <p>🏢 Company Logo {error ? '(Fallback)' : '(Dynamic)'}</p>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: 5 }}>
            Company logo is managed separately below ↓
          </p>
        </div>
        {error && (
          <div className="error-message">
            <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ {error} (Logo fallback in use)</p>
          </div>
        )}
      </div>

      {/* Content Counter */}
      <div className="content-counter">
        <div className="counter-card">
          <h3>📊 Content Management Dashboard</h3>
          <div className="counter-stats">
            <div className="stat-item">
              <span className="stat-number">{savedData.length}</span>
              <span className="stat-label">Total Content Items</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{isEditing ? 'Editing' : 'Ready'}</span>
              <span className="stat-label">Form Status</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{loading ? 'Loading...' : 'Connected'}</span>
              <span className="stat-label">API Status</span>
            </div>
          </div>
          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Management Section */}
      <div className="form-section">
        <div className="form-card">
          <div className="form-header">
            <h2>{isEditing ? 'Edit Content' : 'Add New Content'}</h2>
            <p>{isEditing ? 'Update the content below' : 'Add multiple content items - each with its own image, heading, subheading, and paragraph. Company logo is managed separately below.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="content-form">
            {/* Image Upload */}
            <div className="form-group">
              <label htmlFor="logo_image" className="form-label">📷 Upload Content Image</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="logo_image"
                  name="logo_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                />
                <label htmlFor="logo_image" className="image-upload-label">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <span className="change-text">Change Image</span>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📷</div>
                      <p>Click to select an image</p>
                      <span>or drag and drop</span>
                    </div>
                  )}
                </label>
              </div>
              
              {/* Debug info for logo_image */}
              {formData.logo_image && (
                <div style={{ marginTop: 10, padding: 10, backgroundColor: '#e8f5e8', borderRadius: 4, border: '1px solid #28a745' }}>
                  <p style={{ margin: 0, fontSize: '0.9em', color: '#155724' }}>
                    <strong>✅ Image selected:</strong> {formData.logo_image.name} ({formData.logo_image.size} bytes)
                  </p>
                </div>
              )}
            </div>

            {/* Logo Text Input */}
            <div className="form-group">
              <label htmlFor="logo_text" className="form-label">🏷️ Logo Text</label>
              <input
                type="text"
                id="logo_text"
                name="logo_text"
                value={formData.logo_text}
                onChange={handleInputChange}
                placeholder="Enter logo text here..."
                className="form-input"
              />
            </div>

            {/* Heading Input */}
            <div className="form-group">
              <label htmlFor="heading" className="form-label">📝 Heading</label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                placeholder="Enter your heading here..."
                className="form-input"
                required
              />
            </div>

            {/* Subheading Input */}
            <div className="form-group">
              <label htmlFor="subheading" className="form-label">📋 Subheading</label>
              <input
                type="text"
                id="subheading"
                name="subheading"
                value={formData.subheading}
                onChange={handleInputChange}
                placeholder="Enter your subheading here..."
                className="form-input"
                required
              />
            </div>

            {/* Paragraph Input */}
            <div className="form-group">
              <label htmlFor="paragraph" className="form-label">📄 Paragraph</label>
              <textarea
                id="paragraph"
                name="paragraph"
                value={formData.paragraph}
                onChange={handleInputChange}
                placeholder="Enter your paragraph content here..."
                className="form-textarea"
                rows="6"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? '⏳ Processing...' : (isEditing ? '🔄 Update Content' : '➕ Add New Content')}
              </button>
              <button 
                type="button" 
                onClick={resetForm} 
                className="reset-btn"
                disabled={loading}
              >
                {isEditing ? '❌ Cancel Edit' : '🔄 Reset Form'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Separate Company Logo Section */}
      <div className="form-section" style={{ marginTop: 30 }}>
        <div className="form-card">
          <div className="form-header">
            <h2>🏢 Company Logo Management</h2>
            <p>Upload and manage your company logo separately from content</p>
          </div>

          <div className="company-logo-section">
            {/* Current Company Logo Display */}
            <div className="current-logo-display">
              <h3>Current Company Logo</h3>
              {companyLogo && companyLogo !== "/travel-logo.png" ? (
                <div className="logo-preview-container">
                  <img 
                    src={companyLogo} 
                    alt="Current Company Logo" 
                    style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8, border: '2px solid #ddd' }}
                  />
                  {companyLogoFilename && (
                    <p><strong>Current logo:</strong> {companyLogoFilename}</p>
                  )}
                </div>
              ) : (
                <div className="no-logo">
                  <p>No company logo set yet</p>
                </div>
              )}
            </div>

            

            {/* Company Logo Upload */}
            <div className="logo-upload-section">
              <h3>Upload New Company Logo</h3>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="company_logo_upload"
                  name="company_logo"
                  accept="image/*"
                  onChange={handleCompanyLogoChange}
                  className="image-input"
                />
                <label htmlFor="company_logo_upload" className="image-upload-label">
                  {companyLogoPreview ? (
                    <div className="image-preview">
                      <img src={companyLogoPreview} alt="Company Logo Preview" />
                      <span className="change-text">Change Company Logo</span>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">🏢</div>
                      <p>Click to select a company logo</p>
                      <span>or drag and drop</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Debug info */}
              {formData.company_logo && (
                <div style={{ marginTop: 15, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #dee2e6' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Selected File Details:</h4>
                  <p><strong>File name:</strong> {formData.company_logo.name}</p>
                  <p><strong>File size:</strong> {formData.company_logo.size} bytes</p>
                  <p><strong>File type:</strong> {formData.company_logo.type}</p>
                  
                  <div style={{ marginTop: 15 }}>
                    <button 
                      type="button" 
                      onClick={() => {
                        console.log('=== FILE SELECTION TEST ===');
                        console.log('formData.company_logo:', formData.company_logo);
                        console.log('formData.company_logo.name:', formData.company_logo?.name);
                        console.log('formData.company_logo.size:', formData.company_logo?.size);
                        console.log('formData.company_logo.type:', formData.company_logo?.type);
                        alert('Check console for file details');
                      }}
                      style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#17a2b8', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 4,
                        cursor: 'pointer',
                        marginRight: 10
                      }}
                    >
                      🔍 Test File Selection
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={handleCompanyLogoUpload}
                      style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 6,
                        cursor: 'pointer',
                        marginRight: 10
                      }}
                      disabled={loading}
                    >
                      {loading ? '⏳ Uploading...' : '💾 Save Company Logo'}
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData(prev => ({ ...prev, company_logo: null }));
                        setCompanyLogoPreview(null);
                      }}
                      style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#6c757d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: 6,
                        cursor: 'pointer'
                      }}
                    >
                      ❌ Clear Selection
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Display Section */}
      {savedData.length > 0 && (
        <div className="table-section">
          <div className="table-card">
            <h3>📋 Content Management Table ({savedData.length} items)</h3>
            <div className="table-container">
              <table className="content-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Heading</th>
                    <th>Subheading</th>
                    <th>Paragraph</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedData.map((item) => (
                    <tr key={item.id}>
                      <td className="id-cell">{item.id}</td>
                      <td className="image-cell">
                        {item.logo_image ? (
                          <img src={`${BackendUrl}${item.logo_image}`} alt={item.heading} />
                        ) : (
                          <span>No image</span>
                        )}
                      </td>
                      <td className="heading-cell">{item.heading}</td>
                      <td className="subheading-cell">{item.subheading}</td>
                      <td className="paragraph-cell">
                        <div className="paragraph-content">
                          {item.paragraph.length > 100 
                            ? `${item.paragraph.substring(0, 100)}...` 
                            : item.paragraph
                          }
                        </div>
                      </td>
                      <td className="actions-cell">
                        <div className="table-actions">
                          <button 
                            onClick={() => handleEdit(item)} 
                            className="table-edit-btn"
                            title="Edit"
                            disabled={loading}
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="table-delete-btn"
                            title="Delete"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && savedData.length === 0 && (
        <div className="loading-state">
          <div className="loading-card">
            <h3>⏳ Loading...</h3>
            <p>Please wait while we fetch your content data.</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && savedData.length === 0 && (
        <div className="empty-state">
          <div className="empty-card">
            <h3>🚀 Get Started</h3>
            <p>No content added yet. Use the form above to add your first content item!</p>
            <div className="empty-features">
              <div className="feature">
                <span>🏢</span>
                <p>Company Logo (Separate Section)</p>
              </div>
              <div className="feature">
                <span>📝</span>
                <p>Multiple Content Items</p>
              </div>
              <div className="feature">
                <span>🔄</span>
                <p>Easy Management</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Front