import os
import sys
from setuptools import setup, find_packages
from tethys_apps.app_installation import custom_develop_command, custom_install_command

# -- Apps Definition -- #
app_package = 'malaria'
release_package = 'tethysapp-' + app_package
app_class = 'malaria.app:Malaria'
app_package_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tethysapp', app_package)

# -- Python Dependencies -- #
dependencies = ['rasterio', 'fiona', 'gdal', 'numpy']

setup(
    name=release_package,
    version='1.0.0',
    tags='&quot;Health&quot;, &quot;Malaria&quot;, &quot;Forecast&quot;, &quot;Prediction&quot;, &quot;LDAS&quot;',
    description='An app for running disease spread models developed at John Hopkins University and using global datasets from NASA LDAS',
    long_description='',
    keywords='',
    author='Riley Hales',
    author_email='',
    url='',
    license='',
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    namespace_packages=['tethysapp', 'tethysapp.' + app_package],
    include_package_data=True,
    zip_safe=False,
    install_requires=dependencies,
    cmdclass={
        'install': custom_install_command(app_package, app_package_dir, dependencies),
        'develop': custom_develop_command(app_package, app_package_dir, dependencies)
    }
)
