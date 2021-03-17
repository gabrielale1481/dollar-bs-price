import { useSnackbar } from 'notistack'
import socketClient from 'socket.io-client'
import { useState, useEffect, useContext, createContext } from 'react'

import Button from '@material-ui/core/Button'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'

import historicalJSON from '../../historical';

const DollarContext = createContext();

export const useDollar = function(){

    const ctx = useContext(DollarContext);

    if( !ctx ) throw new Error("useDollar() hook must be used inside its provider")

    return ctx;

}

export default function DollarProvider({ children }){

    const { enqueueSnackbar } = useSnackbar();

    const [historical, setHistorical] = useState(function(){
        return historicalJSON
    });

    const [updatingDollarPrice, setUpdatingDollarPrice] = useState(false);

    useEffect(() => {

        const socket = socketClient("http://localhost:3000");

        socket.on("updatingDollar", () => setUpdatingDollarPrice(true));

        socket.on("dollarUpdateFails", function( retry ){

            setUpdatingDollarPrice(false);
            
            if( retry < 2 ) {
                enqueueSnackbar("Intentando de nuevo en 3 segundos", { variant: "warning" })
                enqueueSnackbar("Ha ocurrido un error al intentar actualizar el precio", { variant: "error" })
            } else {
                enqueueSnackbar("No se pudo actualizar el precio debido a un error interno", {
                    variant: "error",
                    action: (<>
                        <Button rel="noreferrer" href="mailto:gabrielale1481@gmail.com?subject=Error en currentdollarbsprice.com&body=Error: No se pudo actualizar el precio debido a un error interno" >
                            Reportar
                        </Button>
                    </>)
                })
            }

        });

        socket.on("dollarUpdated", function(data){
            setUpdatingDollarPrice(false);
            setHistorical(data);
        })

    }, [])

    return (<>
        <Loading on={updatingDollarPrice} />
        <DollarContext.Provider
            children={children}
            value={{
                current: historical[0],
                historical: historical.slice(1)
            }}
        />
    </>)

}

const useStyles = makeStyles(theme => ({
    bdrop: {
        flexDirection: "column",
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: "rgba(255, 255, 255, .8)"
    },
    txt: { marginTop: 16 * 2 }
}))

const Loading = function({ on }){

    const classes = useStyles();

    if( on === false ) return null;

    return (<>
        <Backdrop className={classes.bdrop} open={on}>
            <CircularProgress />
            <Typography align="center" variant="body2" className={classes.txt}>
                Actualizando precio del dólar
                <br />
                El proceso puede tardar un poco, por favor espere
            </Typography>
        </Backdrop>
    </>)

}