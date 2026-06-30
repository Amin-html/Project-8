from django.db import models
from django.contrib.auth.models import User

class Brand(models.Model):
    """Бренд автомобиля — Toyota, BMW, Mercedes"""
    name = models.CharField(max_length=1000)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)

    def __str__(self):
        return self.name

class Car(models.Model):
    """Автомобиль в каталоге"""
    BODY_CHOICES = [
        ('sedan', 'Седан'),
        ('suv', 'Внедорожник'),
        ('hatchback', 'Хэтчбек'),
        ('coupe', 'Купе'),
        ('wagon', 'Универсал'),
    ]
    TRANSMISSION_CHOICES = [
        ('auto', 'Автомат'),
        ('manual', 'Механика'),
        ('PDK', 'Робот (PDK)')
    ]
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='cars')
    model = models.CharField(max_length=100)    # модель — Camry, X5
    year = models.IntegerField()                # год выпуска
    price = models.IntegerField()               # цена в сомах
    mileage = models.IntegerField()             # пробег в км
    body_type = models.CharField(max_length=20, choices=BODY_CHOICES)
    transmission = models.CharField(max_length=10, choices=TRANSMISSION_CHOICES)
    engine_volume = models.FloatField()         # объём двигателя
    color = models.CharField(max_length=50)
    description = models.TextField()
    image = models.ImageField(upload_to='cars/', blank=True, null=True)
    is_available = models.BooleanField(default=True)  # в наличии?
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']   # новые сначала

    def __str__(self):
        return f"{self.brand.name} {self.model} {self.year}"

class UserProfile(models.Model):
    """Расширенный профиль пользователя"""
    # OneToOneField — один пользователь = один профиль
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Профиль {self.user.username}"

class Favorite(models.Model):
    """Избранные машины пользователя"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='favorite_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Нельзя добавить одну машину дважды
        unique_together = ['user', 'car']

    def __str__(self):
        return f"{self.user.username} → {self.car}"
# Create your models here.
