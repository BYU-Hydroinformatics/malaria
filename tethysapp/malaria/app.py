from tethys_sdk.base import TethysAppBase, url_map_maker
from tethys_sdk.app_settings import CustomSetting

# todo figure out what timescale of data the app will need -> update the spatial averages functions
# todo make the app animate the data with time?
# todo make the app convert the netcdfs to geotiffs
# todo get the rest of the boundaries shapefiles

class Malaria(TethysAppBase):
    """
    Tethys app class for Malaria Spread Predictor.
    """

    name = 'Malaria Spread Predictor'
    index = 'malaria:home'
    icon = 'malaria/images/icon.gif'
    package = 'malaria'
    root_url = 'malaria'
    color = '#f53636'
    description = 'An app for forecasting malaria spread using dispersion models developed at John Hopkins University and using global datasets from NASA LDAS'
    tags = '&quot;Health&quot;, &quot;Malaria&quot;, &quot;Forecast&quot;, &quot;Prediction&quot;, &quot;LDAS&quot;'
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            # PRIMARY NAVIGABLE PAGES
            UrlMap(
                name='home',
                url='malaria',
                controller='malaria.controllers.home'
            ),
            # AJAX PAGES
            UrlMap(
                name='customsettings',
                url='malaria/ajax/customsettings',
                controller='malaria.ajax.customsettings'
            ),
            UrlMap(
                name='updatedistricts',
                url='malaria/ajax/updatedistricts',
                controller='malaria.ajax.refresh_district_averages'
            ),
        )

        return url_maps

    def custom_settings(self):
        settings = (
            CustomSetting(
                name='datadirpath',
                type=CustomSetting.TYPE_STRING,
                description='Path to the DIRECTORY of netCDF data for this app. ex ~/Users/rileyhales/thredds/malaria',
                required=True,
                # /opt/tomcat/content/thredds/public/testdata/malaria/ on tethys.byu.edu
            ),
            CustomSetting(
                name='threddsurl',
                type=CustomSetting.TYPE_STRING,
                description='URL of the thredds wms for this app\'s data. ex byu.edu/thredds/wms/',
                required=True,
                # https://tethys.byu.edu/thredds/wms/testAll/malaria/
            ),
        )
        return settings
