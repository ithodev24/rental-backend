import type { HttpContext } from '@adonisjs/core/http'
import Mail from '@adonisjs/mail/services/main'

export default class KontakController {
  async kirimPesan({ request, response }: HttpContext) {
    const { nama, email, pesan, source } = request.only(['nama', 'email', 'pesan', 'source'])

    try {
      await Mail.send((message) => {
        message
          .from('no-reply@yourdomain.com')
          .replyTo(email)
          .to('dhia.zahrah1511@gmail.com')
          .subject(`[${source}] Kritik & Saran dari ${nama}`)
          .html(`
            <p><strong>Website:</strong> ${source}</p>
            <p><strong>Nama:</strong> ${nama}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Pesan:</strong><br/>${pesan}</p>
          `)
      })

      return response.ok({ message: 'Pesan berhasil dikirim' })
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Gagal mengirim pesan' })
    }
  }
}
