import CssBaseline from '@material-ui/core/CssBaseline'

const App = function({ Component, pageProps }){
    return (<>
        <CssBaseline />
        <Component {...pageProps} />
    </>)
}

export default App