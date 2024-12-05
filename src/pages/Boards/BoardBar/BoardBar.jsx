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
import { capitalizeFirstLetter } from '~/ulti/formatter'
const MenuStyle = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar(props) {
  const { board } = props
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'auto',
        paddingX: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MenuStyle}
            icon={<DashboardIcon />}
            label= {board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MenuStyle}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
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
          sx ={{ color: 'white', borderColor: 'white', border: '1px solid' }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={3}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: 'a4b0be' }
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
