def nc_to_geotiff(var):
    """
    This script accepts a netcdf file in a geographic coordinate system, specifically the NASA GLDAS netcdfs, and
    extracts the data from one variable and the lat/lon steps to create a geotiff of that information.
    """
    import netCDF4
    import numpy
    import gdal
    import osr
    from .app import Malaria as App
    import os

    # Reading in data from the netcdf
    ncpath = os.path.join(App.get_custom_setting('datadirpath'), 'LIS_HIST_20070427.nc')
    nc_obj = netCDF4.Dataset(ncpath, 'r')
    var_data = nc_obj.variables[var][:]
    lat = nc_obj.variables['lat'][:]
    lon = nc_obj.variables['lon'][:]

    # format the array of information going to the tiff
    array = numpy.asarray(var_data)[:, :]
    array[array > 10000] = numpy.nan                # change the comparator to git rid of the fill value
    array = array[::-1]       # vertically flip the array so the orientation is right (you just have to, try it without)

    # Creates geotiff raster file (filepath, x-dimensions, y-dimensions, number of bands, datatype)
    geotiffdriver = gdal.GetDriverByName('GTiff')
    wksp_path = App.get_app_workspace().path
    save_path = os.path.join(wksp_path, 'geotiffs', str(var) + 'geotiff.tif')
    new_geotiff = geotiffdriver.Create(save_path, len(lon), len(lat), 1, gdal.GDT_Float32)

    # geotransform (sets coordinates) = (x-origin(left), x-width, x-rotation, y-origin(top), y-rotation, y-width)
    yorigin = lat.max()
    xorigin = lon.min()
    yres = (lat.max() - lat.min()) / len(lat)
    xres = (lon.max() - lon.min()) / len(lon)
    new_geotiff.SetGeoTransform((xorigin, xres, 0, yorigin, 0, -yres))

    # Set the projection of the geotiff (Projection EPSG:4326, Geographic Coordinate System WGS 1984 (degrees lat/lon)
    new_geotiff.SetProjection(osr.SRS_WKT_WGS84)

    # actually write the data array to the tiff file and save it
    new_geotiff.GetRasterBand(1).WriteArray(array)      # write band to the raster (variable array)
    new_geotiff.FlushCache()                            # write to disk

    return


def spatialaverage(polygondata, var):
    """
    Spatial average returns the arithmetic mean of the values in a netcdf raster within the boundaries of a shapefile
    """
    import rasterio
    from rasterio.mask import mask
    import numpy
    from .app import Malaria as App
    import os

    # read the raster into a rasterio object
    rasterpath = os.path.join(App.get_app_workspace().path, 'geotiffs', str(var) + 'geotiff.tif')
    raster_obj = rasterio.open(rasterpath)

    # clip the raster to the correct area
    clipped_raster, clipped_transform = rasterio.mask.mask(raster_obj, polygondata, crop=True)

    # compute the mean
    array = numpy.asarray(clipped_raster)
    array[array < -1000] = numpy.nan  # change the comparator to git rid of the fill value
    array = array.flatten()
    array = array[~numpy.isnan(array)]
    mean = array.mean()

    return mean


def compute_district_averages():
    """
    gets run whenever you need to recompute the district averages for variables
    """
    from .app import Malaria as App
    import os
    import json

    districtaverages = {}
    apppath = os.path.join(str(App.get_app_workspace()), '')
    districtsdir = os.path.join(apppath, 'districts')
    districtspaths = os.listdir(districtsdir)

    for i in range(len(districtspaths)):
        path = os.path.join(districtsdir, districtspaths[i])
        with open(path, 'r') as jsonfile:
            districtaverages[districtspaths[i]] = spatialaverage(json.load(jsonfile))
    path = os.path.join(apppath, 'districtaverages.json')
    json.dump(path, districtaverages)

    return districtaverages


def definecurrentrisks():
    """
    reads the most recent csv and creates a dictionary of the form {ubigeo#: risk}
    """
    import pandas
    import os
    from .app import Malaria as App

    path = App.get_app_workspace().path
    path = os.path.join(path, 'output.csv')
    df = pandas.read_csv(path)[['ubigeo', 'risk']].to_dict()
    risk = {}

    for row in df['ubigeo']:
        risk[df['ubigeo'][row]] = df['risk'][row]
    print(risk)

    return risk
