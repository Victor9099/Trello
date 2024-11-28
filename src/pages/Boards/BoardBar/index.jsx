import { Box, Button, Tooltip } from '@mui/material'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
const MenuStyle = {
  color: 'primary.main',
  backgroundColor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        Overflow: 'auto',
        borderTop: '1px solid ',
        borderColor: 'primary.main',
        backgroundColor: 'white',
        paddingX: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MenuStyle}
          icon={<DashboardIcon />}
          label="Mern Stack Board"
          clickable
        />
        <Chip
          sx={MenuStyle}
          icon={<VpnLockIcon />}
          label="Public/Private WorkSpace"
          clickable
        />
        <Chip
          sx={MenuStyle}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          clickable
        />
        <Chip sx={MenuStyle} icon={<BoltIcon />} label="Automation" clickable />
        <Chip
          sx={MenuStyle}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          disableElevation
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>
        <AvatarGroup
          max={3}
          sx={{
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16
            }
          }}
        >
          <Tooltip title="Full Stack">
            <Avatar alt="Full Stack" src="../../../assets/Cat.jpeg" />
          </Tooltip>
          <Tooltip title="Full Stack">
            <Avatar alt="Full Stack" src="../../../assets/Cat.jpeg" />
          </Tooltip>
          <Tooltip title="Full Stack">
            <Avatar alt="Full Stack" src="../../../assets/Cat.jpeg" />
          </Tooltip>
          <Tooltip title="Full Stack">
            <Avatar alt="Full Stack" src="../../../assets/Cat.jpeg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
