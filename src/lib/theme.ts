import { createTheme } from "@mui/material";

const theme = createTheme({
    components: {
        MuiContainer: {
			defaultProps: {
				maxWidth: false,
			},
		},
		MuiCssBaseline : {
			styleOverrides: () => ({
				display: 'flex',
			  }),
		}
    }
})

export default theme