import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import ModeCommentIcon from '@mui/icons-material/ModeComment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Button from '@mui/material/Button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
function CardTrello({ cardT }) {
  //Keo tha Card
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: cardT._id, data: {...cardT} })
  const dndKitCardStyle = {
    touchAction: 'none', // Fix loi
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }
  const shouldShowCardActions = () => {
    return (
      !!cardT?.memberIds?.length ||
      !!cardT?.comments?.length ||
      !!cardT?.attachments?.length
    )
  }
  return (
    <Card
      ref={setNodeRef}
      style={dndKitCardStyle}
      {...attributes}
      {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1 px rgba(0, 0, 0, 0.2)',
        overflow: 'unset'
      }}
    >
      {cardT?.cover && <CardMedia sx={{ height: 140 }} image={cardT?.cover} />}
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {cardT?.title}
        </Typography>
      </CardContent>
      {shouldShowCardActions() && (
        <CardActions sx={{ p: '0 4px 8px 4px' }}>
          {!!cardT?.memberIds?.length && (
            <Button size="small" startIcon={<GroupIcon />}>
              {cardT?.memberIds?.length}
            </Button>
          )}
          {!!cardT?.comments?.length && (
            <Button size="small" startIcon={<ModeCommentIcon />}>
              {cardT?.comments?.length}
            </Button>
          )}
          {!!cardT?.attachments?.length && (
            <Button size="small" startIcon={<AttachmentIcon />}>
              {cardT?.attachments?.length}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  )
}

export default CardTrello
