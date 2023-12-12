import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Snackbar,
  Alert,
  Link,
  Typography,
  Box,
  Divider,
  Stack,
  Container,
} from "@mui/material";
import {
  Scrypt,
  ScryptProvider,
  SensiletSigner,
  PandaSigner,
  ContractCalledEvent,
  ByteString,
  Signer,
  TAALSigner,
  bsv,
  toByteString,
} from "scrypt-ts";
import { Voting } from "./contracts/voting";
import Footer from "./Footer";
import Popup from "reactjs-popup";

type Success = {
  txId: String
  candidate: string
}

function App() {

  const contractId = {
    txId: "ab8f3ea22cb9eb1407470388414f4161bfa152c0c8c53864029a258f429f686b",
    outputIndex: 0
  }

  const signerRef = useRef<SensiletSigner>()
  const [error, setError] = React.useState("")
  const [contract, setContract] = React.useState<Voting>()
  const [success, setSuccess] = React.useState<Success>({
    txId: '',
    candidate: ''
  })
  
  useEffect(() => {
    const provider = new ScryptProvider()
    const signer = new SensiletSigner(provider)
  
    signerRef.current = signer

    fetchContract()

    const subscription = Scrypt.contractApi.subscribe(
    {
      clazz: Voting,
      id: contractId
    }, 
    (event: ContractCalledEvent<Voting>) => {
      setSuccess({
        txId: event.tx.id,
        candidate: event.args[0] as ByteString
      })
      setContract(event.nexts[0])
    }
    )
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchContract() {
    try {
      const instance = await Scrypt.contractApi.getLatestInstance(
        Voting,
        contractId
      )
      setContract(instance)
    } catch(error: any) {
      console.log("error while fetching contract: ", error)
      setError(error.message)
    }
  }

  async function vote(e: any) {
    await fetchContract()

    const signer = signerRef.current as SensiletSigner

    if (contract && signer) {
      const { isAuthenticated, error} = await signer.requestAuth()
      if (!isAuthenticated) {
        throw new Error(error)
      }

      await contract.connect(signer)

      const nextInstance = contract.next()

      const candidateName = e.target.name 
      if (candidateName == "iPhone") {
         nextInstance.candidates[0].votesReceived++
      } else if ( candidateName == 'Android') {
        nextInstance.candidates[1].votesReceived++
      }
      contract.methods.vote(
        toByteString(candidateName, true),
       {
        next: {
          instance: nextInstance,
          balance: contract.balance
        }
       } 
      ).then(result => {
        console.log(result.tx.id)
      }).catch(e => {
        setError (e.message)
        console.error(e)
      })
      await fetchContract()
    }
  }

  return (
    <div className="App">
        <TableContainer
          component= {Paper}
          variant= "outlined"
          style= {{ width: 1200, height: "80vh", margin: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography variant={"h1"} >
                    iPhone                    
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant={"h1"} >
                    Android
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>              
              <TableRow>
                <TableCell align="center">
                  <Box>
                     <Box
                      sx={{
                        height: 200,
                      }}
                      component="img"
                      alt={"iPhone"}
                      src={`${process.env.PUBLIC_URL}/${"iphone"}.png`}
                    />
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box>
                    <Box
                      sx={{
                        height: 200,
                      }}
                       component="img"
                       alt={"Android"}
                       src={`${process.env.PUBLIC_URL}/${"android"}.png`} 
                    />   
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h2"}>
                    {contract?.candidates[0].votesReceived.toString()}
                  </Typography>
                  <Button
                  variant="text"
                  name="iPhone"
                  onClick={vote}
                  >
                    👍
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box>
                  <Typography variant={"h2"}>
                    {contract?.candidates[1].votesReceived.toString()}
                  </Typography>
                  <Button
                  variant="text"
                  name="Android"
                  onClick={vote}
                  >
                    👍
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={error !== ''}
        autoHideDuration={6000}
      >
        <Alert severity='error'>{error}</Alert>
      </Snackbar>
      <Snackbar
        open={success.candidate !== "" && success.txId !== ""}
        autoHideDuration={6000}
      >
        <Alert severity='success'>
          {` ${Buffer.from(success.candidate, 'hex').toString('utf8')} got a vote.`}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default App;