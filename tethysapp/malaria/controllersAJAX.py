from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


@login_required()
def customsettings(request):
    """
    sends the custom settings for the app
    """
    from .app import Malaria as App
    return JsonResponse({'threddsurl': App.get_custom_setting('threddsurl')})