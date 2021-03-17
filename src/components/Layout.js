import DollarProvider from 'context'

export default function Layout({ children }){

    return (<>
        <DollarProvider>
            {children}
        </DollarProvider>
    </>);

}