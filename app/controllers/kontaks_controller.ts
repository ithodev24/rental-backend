import type { HttpContext } from '@adonisjs/core/http'
import Mail from '@adonisjs/mail/services/main'

export default class KontakController {
  async kirimPesan({ request, response }: HttpContext) {
    const { nama, email, pesan, source } = request.only(['nama', 'email', 'pesan', 'source'])

    try {
      await Mail.send((message) => {
        message
          // .from('no-reply@yourdomain.com')
          .replyTo(email)
          .to('dhia.zahrah1511@gmail.com')
          .subject(`[${source}] Kritik & Saran dari ${nama}`).html(`
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h1 style="color: #ffbb00ff; font-size: 2rem;">Website ${source}</h1>
              <table style="width: 100%; border-collapse: collapse; font-size: 1rem;">
                <tr>
                  <td style="font-weight: bold; width: 120px;">Website:</td>
                  <td>${source}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Nama:</td>
                  <td>${nama}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Email:</td>
                  <td>${email}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; vertical-align: top;">Pesan:</td>
                  <td style="white-space: pre-line;">${pesan}</td>
                </tr>
              </table>
            </div>
          `)
      })

      return response.ok({ message: 'Pesan berhasil dikirim' })
    } catch (error) {
      console.error(error)
      return response.internalServerError({ message: 'Gagal mengirim pesan' })
    }
  }
}
