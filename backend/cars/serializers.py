from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Brand, Car, UserProfile, Favorite

class BrandSerializer(serializers.ModelSerializer):
    # Считаем количество машин каждого бренда
    cars_count = serializers.IntegerField(
        source='cars.count',
        read_only=True
    )

    class Meta:
        model = Brand
        fields = ['id', 'name', 'logo', 'cars_count']

class CarSerializer(serializers.ModelSerializer):
    # Вложенный сериализатор — показываем объект бренда а не просто id
    brand_detail = BrandSerializer(source='brand', read_only=True)
    image_url = serializers.SerializerMethodField()
    # Человекочитаемые значения choices
    body_type_display = serializers.CharField(
        source='get_body_type_display',
        read_only=True
    )
    transmission_display = serializers.CharField(
        source='get_transmission_display',
        read_only=True
    )

    class Meta:
        model = Car
        fields = [
            'id', 'model', 'year', 'price', 'mileage',
            'body_type', 'body_type_display',
            'transmission', 'transmission_display',
            'engine_volume', 'color', 'description',
            'image_url', 'is_available', 'created_at',
            'brand', 'brand_detail',
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

class UserProfileSerializer(serializers.ModelSerializer):
    # Показываем данные пользователя через профиль
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'phone', 'city', 'bio', 'avatar_url']

    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
        return None

class FavoriteSerializer(serializers.ModelSerializer):
    # Показываем полные данные машины в избранном
    car_detail = CarSerializer(source='car', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'car', 'car_detail', 'created_at']