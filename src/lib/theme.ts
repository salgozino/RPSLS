import { createTheme } from "@mui/material";

const theme = createTheme({
    components: {
        MuiContainer: {
			defaultProps: {
				maxWidth: false,
			},
		},
    }
})

export default theme