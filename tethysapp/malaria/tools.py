def definecurrentrisks():
    """
    reads the most recent csv and creates a dictionary of the form {ubigeo#: risk}
    """
    import pandas
    import os
    from .app import Malaria as App

    path = App.get_app_workspace().path
    path = os.path.join(path, 'output.csv')
    df = pandas.read_csv(path)[['ubigeo', 'risk']].to_dict()        # dictionary with keys ubigeo and risk: {#: value}
    risk = {}
    for row in df['ubigeo']:                            # combine the dictionaries into a single dictionary
        risk[df['ubigeo'][row]] = df['risk'][row]
    return risk
