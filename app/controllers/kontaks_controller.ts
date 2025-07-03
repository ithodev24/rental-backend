// app/Controllers/Http/KontakController.ts
import type { HttpContext } from '@adonisjs/core/http'
import Mail from '@adonisjs/mail/services/main'


export default class KontakController {
  async kirimPesan({ request, response }: HttpContext) {
    const { nama, email, pesan } = request.only(['nama', 'email', 'pesan'])

    try {
      await Mail.send((message) => {
        message
          .from('no-reply@yourdomain.com')
          .replyTo(email)  
          .to('dhia.zahrah1511@gmail.com') // ganti dengan email tujuan kamu
          .subject(`Kritik & Saran dari ${nama}`)
          .html(`
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
