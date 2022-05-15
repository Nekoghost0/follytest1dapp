import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import {
  NoEthereumProviderError
} from "@web3-react/injected-connector";

import { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal'

import { injected, POLLING_INTERVAL, bscwallet, walletconnect } from "../../hooks/connectors";
import { useEagerConnect, useInactiveListener } from "../../hooks/hooks";
import metamask_img from '../../images/metamask.svg'
import trustwallet_img from '../../images/trustwallet.svg'
import walletconnect_img from '../../images/walletconnect.svg'
import binance_img from '../../images/binance.svg';



export function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export const ConnectButton = function () {
  const context = useWeb3React();
  const { connector, chainId, account, activate, deactivate, active, error } = context;
  const [Show, setShow] = useState(false);

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  function getErrorMessage(error) {

    if (error instanceof NoEthereumProviderError) {
      return "Metamask not deteced";
    }
    if (error instanceof UnsupportedChainIdError) {
      return "Switch Network";
    }
    console.log(error);
    deactivate(bscwallet);
    deactivate(walletconnect);
    deactivate(injected);
  }



  // handle logic to connect in reaction to certain events on the bscwallet ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const activating = (connection) => connection === activatingConnector;
  const connected = (connection) => connection === connector;


  return (

    <>

      {
        error &&
        <button className="hero-btn btn1 mint-btn" onClick={() => {
          setShow(true);
        }}>
          {getErrorMessage(error)}
        </button>
      }
      {!error &&
        <>

          {(connected(bscwallet) || connected(walletconnect) || connected(injected)) && typeof chainId === 'undefined' &&
            <button className="hero-btn btn1 mint-btn">
              <div className="font-bold self-center">Switch Network Bsc Mainnet</div>
            </button>

          }
          {(active || !error) && (connected(bscwallet) || connected(walletconnect) || connected(injected)) &&
            <button className="hero-btn btn1 mint-btn" onClick={() => {
              setActivatingConnector();
              deactivate(bscwallet);
              deactivate(walletconnect);
              deactivate(injected);

            }}>

              {account && account.toString().substr(0, 5) + "...." + account.toString().substr(-5)}
            </button>


          }
          {!(connected(bscwallet) || connected(walletconnect) || connected(injected)) &&

            <button className="hero-btn btn1 mint-btn" onClick={() => {
              setShow(true);
            }}>
              {(activating(bscwallet) || activating(walletconnect) || activating(injected)) && <div className="font-bold self-center">Connecting...</div>}
              {(!activating(bscwallet) || !activating(walletconnect) || !activating(injected)) && <div className="font-bold self-center">Connect wallet</div>}
            </button>
          }
        </>
      }

      <Modal
        size="lg"
        show={Show}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" className="text-dark">
            Connect Wallet
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card-content clearfix">
            <div id="A" className="card left-half">
              <div className="ml-auto mt-auto">
                <img src={metamask_img} alt="metamask img" height="50px" width="100px" />
              </div>
              <div>

                <button className="btn btn-primary mt-3" onClick={() => {
                  setActivatingConnector();
                  activate(injected);
                  setShow(false);


                }}>Metamask</button>
              </div>
            </div>
            <div id="B" className="card right-half">
              <div className="ml-auto mt-auto">
                <img src={trustwallet_img} height="50px" width="100px" alt="trutwallet img" />
              </div>
              <div>
                <button className="btn btn-primary mt-3" onClick={() => {
                  setActivatingConnector();
                  activate(injected);
                  setShow(false);

                }}>TrustWallet</button>
              </div>
            </div>
            <div id="C" className="card left-half">
              <div className="ml-auto mt-auto">
                <img src={binance_img} height="50px" width="100px" alt="binance img" />

              </div>
              <div>
                <button className="btn btn-primary mt-3" onClick={() => {
                  setActivatingConnector();
                  activate(bscwallet);
                  setShow(false);

                }}>Binance Wallet</button>
              </div>
            </div>
            <div id="D" className="card right-half">
              <div className="ml-auto mt-auto">
                <img src={walletconnect_img} height="50px" width="100px" alt="walletconnect img" />

              </div>
              <div>
                <button className="btn btn-primary mt-3" onClick={() => {
                  setActivatingConnector();
                  activate(walletconnect);
                  setShow(false);
                }}>WalletConnect</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>

  );
};

export default ConnectButton;