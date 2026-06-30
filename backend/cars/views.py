from django.db.models import Model
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from . import serializers
from .models import Brand, Car, UserProfile, Favorite
from .serializers import (
    BrandSerializer, CarSerializer,
    UserProfileSerializer, FavoriteSerializer
)

class BrandListAPI(generics.ListAPIView):
    """Список всех брендов"""
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]

class CarListAPI(generics.ListAPIView):
    """Список машин с фильтрацией"""
    serializer_class = CarSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Car.objects.filter(is_available=True)
        params = self.request.query_params

        # Фильтр по бренду: /api/cars/?brand=1
        brand = params.get('brand')
        if brand:
            queryset = queryset.filter(brand_id=brand)

        # Фильтр по кузову: /api/cars/?body=suv
        body = params.get('body')
        if body:
            queryset = queryset.filter(body_type=body)

        # Фильтр по трансмиссии: /api/cars/?transmission=auto
        transmission = params.get('transmission')
        if transmission:
            queryset = queryset.filter(transmission=transmission)

        # Фильтр по цене: /api/cars/?min=5000&max=20000
        min_price = params.get('min')
        max_price = params.get('max')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Поиск по модели: /api/cars/?q=camry
        query = params.get('q')
        if query:
            queryset = queryset.filter(model__icontains=query)

        return queryset

class CarDetailAPI(generics.RetrieveAPIView):
    """Одна машина по id"""
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [IsAuthenticated]

class ProfileAPI(APIView):
    """Профиль текущего пользователя"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Получаем или создаём профиль
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(
            profile,
            data=request.data,
            partial=True,   # partial=True — можно обновить только часть полей
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class FavoriteListAPI(generics.ListAPIView):
    """Мои избранные машины"""
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

class FavoriteToggleAPI(generics.GenericAPIView):
    """Добавить/убрать из избранного"""
    permission_classes = [IsAuthenticated]

    def post(self, request, car_id):
        car = Car.objects.get(pk=car_id)
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            car=car
        )
        if not created:
            # Если уже в избранном — убираем
            favorite.delete()
            return Response({'status': 'removed'})
        return Response({'status': 'added'})
# Create your views here.