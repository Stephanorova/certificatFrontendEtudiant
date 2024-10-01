import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent, TextField, Button, Typography } from '@mui/material';
import Navebar from './Navebar/Navebar';

function App() {

  const [certificateNumber, setCertificateNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/api/verify/${certificateNumber}`);
      setVerificationResult(response.data);
      setError('');
    } catch (err) {
      setVerificationResult(null);
      setError('Erreur lors de la vérification du certificat.');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/pdf/${certificateNumber}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${certificateNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Erreur lors du téléchargement du PDF.');
    }
  };




  return (
    <>
    <div>
      <Navebar/>
    </div>
   <div style={{ padding: '20px',marginTop:"3rem", maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Vérification de Certificat Étudiant
      </Typography>
      
      <form onSubmit={handleVerification} style={{ marginBottom: '20px' }}>
        <TextField
          fullWidth
          label="Numéro de Certificat"
          variant="outlined"
          value={certificateNumber}
          onChange={(e) => setCertificateNumber(e.target.value)}
          style={{ marginBottom: '10px' }}
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Vérifier
        </Button>
      </form>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {verificationResult  && (
        <Card>
          <CardHeader title="Résultat de votre vérification" />
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Numéro de certificat:</strong>{verificationResult.certificateNumber}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Nom de l'étudiant:</strong> {verificationResult.studentName}
            </Typography>
            <Button variant="contained" color="success" type="submit"  onClick={handleDownload}>
                  Télécharger votre certificat
               </Button>
          </CardContent>
        </Card>
      )}
    </div> 
    </>
  );
}

export default App;
