import { SnackbarProvider } from 'notistack'
import CssBaseline from '@material-ui/core/CssBaseline'

import Layout from 'components/Layout'

const App = function({ Component, pageProps }){
    return (<>
        <CssBaseline />
        <SnackbarProvider
            maxSnack={4}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SnackbarProvider>
    </>)
}

export default App