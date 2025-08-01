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
                   style={'fontSize': '20px', 'padding': '10px 20px', 'marginBottom': '20px', 'marginRight': '10px'}),
        html.Button('Check for Updates', id='update-button', n_clicks=0, 
                   style={'fontSize': '20px', 'padding': '10px 20px', 'marginBottom': '20px', 'backgroundColor': '#007acc', 'color': 'white', 'border': 'none'}),
        html.Div(id='hello-output', style={'fontSize': '24px', 'textAlign': 'center', 'color': 'blue', 'marginTop': '20px'})
    ], style={'textAlign': 'center', 'marginTop': '50px'})
])

# Callback to handle button clicks
@callback(
    Output('hello-output', 'children'),
    [Input('hello-button', 'n_clicks'),
     Input('update-button', 'n_clicks')]
)
def update_output(hello_clicks, update_clicks):
    ctx = dash.callback_context
    if not ctx.triggered:
        return ""
    
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]
    
    if button_id == 'hello-button' and hello_clicks > 0:
        return "Hello friend 2!"
    elif button_id == 'update-button' and update_clicks > 0:
        # Trigger update check via JavaScript
        return html.Script('window.location.reload(); console.log("Manual update check triggered");')
    
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