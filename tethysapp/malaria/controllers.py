from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import SelectInput, RangeSlider
import datetime, os
from .model import gldas_variables, available_dates

@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    # Get the options for the GLDAS Variables
    variables = gldas_variables()
    variable_opts = []
    for key in sorted(variables.keys()):
        tuple1 = (key, variables[key])
        variable_opts.append(tuple1)
    del tuple1, variables
    date_opts = available_dates()

    variables = SelectInput(
        display_text='Pick a Variable',
        name='variables',
        multiple=False,
        options=variable_opts,
        initial=['Air Temperature'],
    )

    dates = SelectInput(
        display_text='Date Selection',
        name='dates',
        multiple=False,
        options=date_opts,
        initial=[date_opts[0]],
    )

    opacity = RangeSlider(
        display_text='Layer Opacity',
        name='opacity',
        min=.4,
        max=1,
        step=.05,
        initial=.8,
    )

    context = {
        'variables': variables,
        'dates': dates,
        'opacity': opacity,
    }

    return render(request, 'malaria/home.html', context)