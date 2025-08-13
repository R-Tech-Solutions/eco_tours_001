from rest_framework import serializers
from .models import Place, PlaceImage, ItineraryDay, ItineraryPhoto, Booking, Item, Service, GalleryPhoto, Post, Contact, Front, UserDetails
from django.conf import settings

class PlaceImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PlaceImage
        fields = ['id', 'image', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ItineraryPhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ItineraryPhoto
        fields = ['id', 'image', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ItineraryDaySerializer(serializers.ModelSerializer):
    photos = ItineraryPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = ItineraryDay
        fields = ['id', 'day', 'sub_iterative_description', 'sub_description', 'photos']

class PlaceSerializer(serializers.ModelSerializer):
    sub_images = PlaceImageSerializer(many=True, read_only=True)
    itinerary_days = ItineraryDaySerializer(many=True, read_only=True)
    main_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = '__all__'
    
    def get_main_image_url(self, obj):
        if obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
            return obj.main_image.url
        return None

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user',)
        # children_ages will be included automatically if present in the model

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class GalleryPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryPhoto
        fields = ['id', 'image', 'uploaded_at']

class PostSerializer(serializers.ModelSerializer):
    post_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'
    
    def get_post_image_url(self, obj):
        if obj.post_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.post_image.url)
            return obj.post_image.url
        return None

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class FrontSerializer(serializers.ModelSerializer):
    class Meta:
        model = Front
        fields = '__all__'

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = '__all__'