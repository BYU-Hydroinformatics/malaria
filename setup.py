from setuptools import setup, find_namespace_packages
from tethys_apps.app_installation import find_resource_files

# -- Apps Definition -- #
app_package = 'malaria'
release_package = 'tethysapp-' + app_package

# -- Python Dependencies -- #
dependencies = []

setup(
    name=release_package,
    version='0.0.4',
    description='An app for running disease spread models developed at John Hopkins University and using global datasets from NASA LDAS',
    long_description='',
    keywords='Tethys,App,Services,Cool',
    author='Riley Hales',
    author_email='',
    url='https://github.com/BYU-Hydroinformatics/malaria',
    license='BSD 3-Clause License',
    packages=find_namespace_packages(),
    package_data={'': resource_files},
    include_package_data=True,
    zip_safe=False,
    install_requires=dependencies,
)
