import React from 'react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'

class Document extends NextDocument {

    static async getInitialProps(context){

        const sheets = new ServerStyleSheets();
        const originalRenderPage = context.renderPage;

        context.renderPage = () => (
            originalRenderPage({
                enhanceApp: App => props => (
                    sheets.collect(<App {...props}/>)
                )
            })
        )

        const initialProps = await NextDocument.getInitialProps(context);

        return {
            ...initialProps,
            styles: (
                <>
                    {initialProps.styles}
                    {sheets.getStyleElement()}
                </>
            )
        }

    }

    render(){
        return (
            <Html>
                <Head>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }

}

export default Document