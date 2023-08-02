import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import "./App.scss";

function App() {
  const [selectedMatch, setSelectedMatch] = useState("full_match");
  const [address, setAddress] = useState();
  const [chainId, setChainId] = useState("1");
  const [showValidationResults, setShowValidationResults] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [chains, setChains] = useState();

  const formRef = useRef();
  const matches = [
    { name: "Full Match", value: "full_match" },
    { name: "Partial Match", value: "partial_match" },
  ];

  useEffect(() => {
    const getSourcifyChains = async () => {
      const serverUrl = window.configs?.SERVER_URL?.length > 0
          ? window.configs.SERVER_URL
          : "https://sourcify.dev/server"
      const chainsArray = await (
        await fetch(`${serverUrl}/chains`)
      ).json();
      return chainsArray;
    };
    getSourcifyChains()
      .then((chains) => setChains(chains))
      .catch((err) => alert(err));
  }, []);

  const generateRepoURI = (address, chainId, match) => {
    return `/contracts/${match}/${chainId}/${address}`;
  };

  const handleSubmit = (e) => {
    setIsNotFound(false);
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setShowValidationResults(true);
      return;
    }

    const uri = generateRepoURI(address, chainId, selectedMatch);
    // Look ahead if contract exists.
    setIsLoading(true);
    fetch(uri, { redirect: "follow" })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          window.location.href = uri; // Redirect to repo address;
        } else {
          setIsNotFound(true);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setIsNotFound(true);
      });
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    e.target.value
      ? setShowValidationResults(true)
      : setShowValidationResults(false);
    formRef.current.checkValidity()
      ? setIsFormValid(true)
      : setIsFormValid(false);
  };

  const handleSelectMatch = (e) => {
    setSelectedMatch(e.target.value);
  };

  const spinner = (
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    />
  );

  if (!chains) {
    return (
      <div
        className="d-flex align-items-center justify-content-center flex-column"
        style={{ height: "100vh" }}
      >
        <Spinner
          as="span"
          animation="border"
          role="status"
          aria-hidden="true"
        />
        <div className="mt-4">Fetching Sourcify chains</div>
      </div>
    );
  }
  return (
    <div className="App">
      <Card className="card mx-6">
        <div className="px-4 container center text-center column">
          <img
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            className="m-2 logo"
            alt="Sourcify logo"
          />
          <div style={{ fontSize: "32px", fontWeight: "bold" }}>
            Contract Repository
          </div>
          <div className="mb-3 text-center">
            {" "}
            Enter the contract details to view source code and metadata{" "}
          </div>
        </div>
        <Form
          noValidate
          validated={showValidationResults}
          onSubmit={handleSubmit}
          ref={formRef}
          className="mt-4"
        >
          <Alert
            variant="danger"
            onClose={() => setIsNotFound(false)}
            dismissible
            hidden={!isNotFound}
            className="text-center"
          >
            <p>Contract not found in Sourcify repository</p>
            <p> Please check address, chain, and match type</p>
          </Alert>

          <Form.Group controlId="form-address">
            <Form.Label className="label">Contract Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="0x2fa5b..."
              required
              pattern="0x[a-fA-F0-9]{40}$"
              onChange={handleAddressChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid address
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-4" controlId="form-chain">
            <Form.Label className="label">Chain</Form.Label>
            <Form.Select
              aria-label="select chain"
              onChange={(e) => setChainId(e.target.value)}
            >
              {chains.map((chainObj, i) => {
                return (
                  <option key={`chain-option-${i}`} value={chainObj.chainId}>
                    {" "}
                    {chainObj.name}{" "}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="label">Match Type</Form.Label>
            <Form.Check
              className="match-select-container"
              aria-label="select chain"
            >
              {matches.map((match, idx) => (
                <div key={`match-key-${idx}`}>
                  <Form.Check.Input
                    id={`match-${idx}`}
                    value={match.value}
                    type="radio"
                    className="mb-4 me-2 match-radio"
                    checked={selectedMatch === match.value}
                    onChange={handleSelectMatch}
                    onClick={handleSelectMatch}
                  />
                  <Form.Check.Label
                    className={`match-radio ${
                      selectedMatch === match.value ? "selected-radio" : ""
                    }`}
                    htmlFor={`match-${idx}`}
                  >
                    {match.name}
                  </Form.Check.Label>
                </div>
              ))}
            </Form.Check>
          </Form.Group>
          <Button
            className="mt-2"
            variant="primary"
            disabled={!isFormValid}
            type="submit"
            size="lg"
            style={{ width: "100%" }}
          >
            {isLoading ? spinner : "Submit"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default App;
