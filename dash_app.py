import dash
from dash import html, dcc, callback, Output, Input
import os
import sys

# Initialize Dash app
app = dash.Dash(__name__)

# Define the layout
app.layout = html.Div([
    html.H1("Dash Auto-Update Demo", style={'textAlign': 'center', 'marginBottom': '30px'}),
    html.Div([
        html.Button('Click Me!', id='hello-button', n_clicks=0, 
                   style={'fontSize': '20px', 'padding': '10px 20px', 'marginBottom': '20px'}),
        html.Div(id='hello-output', style={'fontSize': '24px', 'textAlign': 'center', 'color': 'blue'})
    ], style={'textAlign': 'center', 'marginTop': '50px'})
])

# Callback to handle button clicks
@callback(
    Output('hello-output', 'children'),
    Input('hello-button', 'n_clicks')
)
def update_output(n_clicks):
    if n_clicks > 0:
        return "Hello friend!"
    return ""

if __name__ == '__main__':
    # Get port from environment variable or default to 8050
    port = int(os.environ.get('DASH_PORT', 8050))
    
    # Run the app
    app.run(
        debug=False,
        host='127.0.0.1',
        port=port,
        dev_tools_ui=False,
        dev_tools_props_check=False
    )