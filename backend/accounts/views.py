from django.contrib.auth.models import User, AbstractUser
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from cars.models import UserProfile

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('emai', '')

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Пользователь уже существует'},
            status=status.HTTP_400_BAD_REQUEST
        )
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )
    # Автоматически создаём профиль при регистрации
    UserProfile.objects.create(user=user)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'username': user.username,
        'user_id': user.id
    })
# Create your views here.
