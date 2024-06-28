import { makeStyles } from "@mui/material";
import { Theme } from '@mui/material/styles';
const useStyles=makeStyles((theme:Theme)=>({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },
}));
export default useStyles;