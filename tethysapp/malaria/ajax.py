from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


@login_required()
def customsettings(request):
    """
    sends the custom settings for the app
    """
    from .app import Malaria as App
    return JsonResponse({'threddsurl': App.get_custom_setting('threddsurl')})


@login_required()
def refresh_district_averages(request):
    """
    gets called if the user chooses to recalculate the district averages manually
    """
    from .tools import computedistrictaverages
    computedistrictaverages()
    return JsonResponse({'updated': True})


@login_required()
def get_polygonaverages(request):
    """
    Gets called when the user draws a polygon on the map to get a spatial average for a variable
    """
    from .tools import spatialaverage
    polygondata = request.body.decode('UTF-8')['polygondata']
    return JsonResponse({'average': spatialaverage('rasterpath', polygondata)})
