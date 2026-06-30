from django.urls import path
from . import views

urlpatterns = [
    path('brands/', views.BrandListAPI.as_view(), name='brand-list'),
    path('cars/', views.CarListAPI.as_view(), name='car-list'),
    path('cars/<int:pk>/', views.CarDetailAPI.as_view()),
    path('profile/', views.ProfileAPI.as_view()),
    path('fovarites/', views.FavoriteListAPI.as_view()),
    path('fovarites/<int:car_id>/', views.FavoriteToggleAPI.as_view()),
]