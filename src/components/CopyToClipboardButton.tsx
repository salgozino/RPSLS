import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'

const CopyToClipboardButton = ({text} : {text:string}) => {
    const [open, setOpen] = useState(false)
    const handleClick = () => {
      setOpen(true)
      navigator.clipboard.writeText(window.location.toString())
    }
    
    return (
        <>
          <Button onClick={handleClick} variant='contained'>{text}</Button>
          <Snackbar
            open={open}
            onClose={() => setOpen(false)}
            autoHideDuration={2000}
            message="Copied to clipboard"
          />
        </>
    )
}

export default CopyToClipboardButton