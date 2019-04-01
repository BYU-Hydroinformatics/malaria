def spatialaverage(rasterpath, polygondata):
    """
    Spatial average returns the arithmetic mean of the values in a netcdf raster within the boundaries of a shapefile
    """
    import rasterio
    from rasterio.mask import mask
    import numpy

    # read the raster into a rasterio object
    raster_obj = rasterio.open(rasterpath)

    # clip the raster to the correct area
    shp_geometry = [feature["geometry"] for feature in polygondata]
    clipped_raster, clipped_transform = rasterio.mask.mask(raster_obj, shp_geometry, crop=True)

    # compute the mean
    array = numpy.asarray(clipped_raster)
    array[array > 1000000000] = numpy.nan  # change the comparator to git rid of the fill value
    array = array.flatten()
    array = array[~numpy.isnan(array)]
    mean = array.mean()

    return mean


def computedistrictaverages():
    """
    gets run whenever you need to recompute the district averages for variables
    """
    from .app import Malaria as App
    import os
    import json

    districtaverages = {}
    apppath = os.path.join(App.get_app_workspace(), '')
    districtsdir = os.path.join(apppath, 'districts')
    districtspaths = os.listdir(districtsdir)

    for i in range(len(districtspaths)):
        path = os.path.join(districtsdir, districtspaths[i])
        with open(path, 'r') as jsonfile:
            districtaverages[districtspaths[i]] = spatialaverage('rasterpath', json.load(jsonfile))
    path = os.path.join(apppath, 'districtaverages.json')
    json.dump(path, districtaverages)

    return districtaverages
