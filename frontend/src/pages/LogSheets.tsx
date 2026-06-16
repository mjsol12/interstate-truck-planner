import { Card, CardContent, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

export default function LogSheets() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        ELD Log Sheets
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Daily driver log sheets will appear here after trip planning is complete.
      </Typography>

      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <DescriptionOutlinedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            ELD log sheets will render here
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Plan a trip first to generate FMCSA-compliant daily log sheets.
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}
