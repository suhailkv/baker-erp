// src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = (open) => {
    setMobileOpen(open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileToggle={handleMobileToggle}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Prevents overflow issues
          bgcolor: 'background.default',
        }}
      >
        {/* Your page content */}
        <Box sx={{ p: { xs: 2, sm: 3 }, flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

// Example usage in your App component:
// import Layout from './components/layout/Layout';
//
// function App() {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/raw-materials" element={<RawMaterials />} />
//           {/* other routes */}
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }