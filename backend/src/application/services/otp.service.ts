export class OtpService {
  // Genera código numérico de 6 dígitos (100000-999999)
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Define expiración a 3 minutos desde ahora
  generateExpiration(): Date {
    const expiration = new Date();

    expiration.setMinutes(expiration.getMinutes() + 3);

    return expiration;
  }
}
