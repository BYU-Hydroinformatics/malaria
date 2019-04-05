from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from .tools import nc_to_geotiff, spatialaverage
import ast

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
    from .tools import compute_district_averages
    compute_district_averages()
    return JsonResponse({'updated': True})


@login_required()
def get_polygonaverages(request):
    """
    Gets called when the user draws a polygon on the map to get a spatial average for a variable
    """
    try:
        data = ast.literal_eval(request.body.decode('utf-8'))
        polygondata = [data['polygondata']]
        variable = data['variable']
        nc_to_geotiff(variable)
        average = spatialaverage(polygondata, variable)
        return JsonResponse({'average': average})
    except:
        import traceback
        traceback.print_exc()
        return JsonResponse({'failed': 'that sucks'})
