from tethys_sdk.base import TethysAppBase, url_map_maker


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
            UrlMap(
                name='home',
                url='malaria',
                controller='malaria.controllers.home'
            ),
        )

        return url_maps
