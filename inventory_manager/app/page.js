'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography, useTheme, useMediaQuery } from "@mui/material";
import { collection, query, getDocs, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        p: 2,
        backgroundColor: '#1B263B', // Deep blue background for a modern look
        overflow: 'auto'
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, color: '#EAECEE', fontWeight: 'bold', textShadow: '2px 2px 8px #000' }}>Inventory Management System</Typography>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: isMobile ? '90%' : 400, // Responsive modal width
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <Typography variant="h6" color="#3498db">Add Item</Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              label="Item Name"
              sx={{ background: '#fff' }} // Ensure the input is clearly visible
            />
            <Button variant="contained" color="primary" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
        Add New Item
      </Button>
      <Box sx={{ width: '90%', maxwidth: 800, mt: 2, border: '1px solid #6C7A89', borderRadius: '8px', bgcolor: '#34495E' }}>
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#5D6D7E', // Soft greyish-blue
              my: 1,
              mx: 2,
              p: 2,
              borderRadius: '4px',
              color: '#ECF0F1', // Light grey text for contrast
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)', // Subtle zoom effect on hover
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
            <Typography variant="h6" sx={{ width: '100px', textAlign: 'center' }}>Quantity: {quantity}</Typography>
            <Button variant="outlined" color="primary" onClick={() => addItem(name)}>
              Add
            </Button>
            <Button variant="outlined" color="error" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
