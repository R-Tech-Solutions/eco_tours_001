from django.urls import path
from .views import (
    get_places, place_detail, create_places, place_delete, place_update,
    delete_itinerary_photo, get_places_for_booking, create_booking, get_bookings, get_booking, update_booking, delete_booking,
    list_items, create_item, get_item, update_item, delete_item,
    list_services, create_service, get_service, update_service, delete_service,
    list_gallery_photos, create_gallery_photo, delete_gallery_photo,
    list_posts, create_post, get_post, update_post, delete_post,
    list_contacts, create_contact, get_contact, update_contact, delete_contact,
    get_latest_social_links, list_front, create_front, get_front, update_front, delete_front, user_list, create_user, get_user, user_update, delete_user
)


urlpatterns = [
    path('places/', get_places, name='get_places'),
    path('places/create/', create_places, name='create_places'),
    path('places/<int:pk>/', place_detail, name='place-detail'),
    path('places/<int:pk>/delete/', place_delete, name='place-delete'),
    path('places/<int:pk>/update/', place_update, name='place-update'),
    path('places/itinerary-photo/<int:photo_id>/delete/', delete_itinerary_photo, name='delete_itinerary_photo'),
    
    # Booking URLs
    path('bookings/places/', get_places_for_booking, name='get_places_for_booking'),
    path('bookings/', get_bookings, name='get_bookings'),
    path('bookings/create/', create_booking, name='create_booking'),
    path('bookings/<int:pk>/', get_booking, name='get_booking'),
    path('bookings/<int:pk>/update/', update_booking, name='update_booking'),
    path('bookings/<int:pk>/delete/', delete_booking, name='delete_booking'),
    
    # Item URLs
    path('items/', list_items, name='list_items'),
    path('items/create/', create_item, name='create_item'),
    path('items/<int:pk>/', get_item, name='get_item'),
    path('items/<int:pk>/update/', update_item, name='update_item'),
    path('items/<int:pk>/delete/', delete_item, name='delete_item'),

    # GalleryPhoto URLs
    path('gallery/photos/', list_gallery_photos, name='list_gallery_photos'),
    path('gallery/photos/create/', create_gallery_photo, name='create_gallery_photo'),
    path('gallery/photos/<int:pk>/delete/', delete_gallery_photo, name='delete_gallery_photo'),

    # Service URLs
    path('services/', list_services, name='list_services'),
    path('services/create/', create_service, name='create_service'),
    path('services/<int:pk>/', get_service, name='get_service'),
    path('services/<int:pk>/update/', update_service, name='update_service'),
    path('services/<int:pk>/delete/', delete_service, name='delete_service'),

    # Post URLs
    path('posts/', list_posts, name='list_posts'),
    path('posts/create/', create_post, name='create_post'),
    path('posts/<int:pk>/', get_post, name='get_post'),
    path('posts/<int:pk>/update/', update_post, name='update_post'),
    path('posts/<int:pk>/delete/', delete_post, name='delete_post'),
    path('posts/create/', create_post, name='create_post'),


    # CONTACTS INFORMATION

    path('contact/', list_contacts, name='list_contacts'),
    path('contacts/create/', create_contact, name='create_contact'),
    path('contacts/<int:pk>/', get_contact,name='get_contact'),
    path('contacts/<int:pk>/update/', update_contact, name='update_contact'),
    path('contacts/<int:pk>/delete/', delete_contact, name='delete_contact'),
    path('social-links/', get_latest_social_links, name='get_latest_social_links'),


    # Front URls

    path('front/', list_front, name='list_front'),
    path('front/create/', create_front, name='create_front'),
    path('front/<int:pk>/', get_front, name='get_front'),
    path('front/<int:pk>/update/', update_front, name='update_front'),
    path('front/<int:pk>/delete/', delete_front, name='delete_front'),


    # UserDetails CRUD URLs
    path('user/', user_list, name='user_list'),
    path('user/create/', create_user, name='create_user'),
    path('user/<int:pk>/', get_user, name='get_user'),
    path('user/<int:pk>/update/', user_update, name='user_update'),
    path('user/<int:pk>/delete/', delete_user, name='delete_user'),



]