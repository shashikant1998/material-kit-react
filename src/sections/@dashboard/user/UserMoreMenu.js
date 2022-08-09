import { useRef, useState } from "react";
import PropTypes from "prop-types";
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
// component
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDeleteButtonPress: PropTypes.func,
  onEditButtonPress: PropTypes.func,
};

export default function UserMoreMenu({
  onDeleteButtonPress,
  onEditButtonPress,
}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          sx={{ color: "text.secondary" }}
          onClick={onDeleteButtonPress}
        >
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Delete"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>

        <MenuItem sx={{ color: "text.secondary" }} onClick={onEditButtonPress}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="Edit"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
