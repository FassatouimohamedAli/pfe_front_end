import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RibVerifService {



  private static readonly banks = [
    { code: '01', name: 'ATB', bic: 'ATBK' },
    { code: '02', name: 'BFT', bic: 'BFTN' },
    { code: '03', name: 'BNA', bic: 'BNTE' },
    { code: '04', name: 'ATTIJARI', bic: 'BSTU' },
    { code: '05', name: 'BT', bic: 'BTBK' },
    { code: '07', name: 'AMEN', bic: 'CFCT' },
    { code: '08', name: 'BIAT', bic: 'BIAT' },
    { code: '10', name: 'STB', bic: 'STBK' },
    { code: '11', name: 'UBCI', bic: 'UBCI' },
    { code: '12', name: 'UIB', bic: 'UIBK' },
    { code: '14', name: 'BH', bic: 'BHBK' },
    { code: '16', name: 'CITI', bic: 'CITI' },
    { code: '17', name: 'POSTE', bic: 'LPTN' },
    { code: '20', name: 'BTK', bic: 'BTKO' },
    { code: '21', name: 'TSB', bic: 'TSIB' },
    { code: '23', name: 'QNB', bic: 'BTQI' },
    { code: '24', name: 'BTE', bic: 'BTEX' },
    { code: '25', name: 'ZITOUNA', bic: 'BZIT' },
    { code: '26', name: 'BTL', bic: 'ATLD' },
    { code: '28', name: 'ABC', bic: 'ABCO' },
    { code: '29', name: 'BFPME', bic: 'BFPM' },
    { code: '32', name: 'ALBARAKA', bic: 'BEIT' },
    { code: '47', name: 'WIFAK', bic: 'WKIB' },
    { code: '81', name: 'ZITOUNAPAY', bic: 'ETZP' }
  ];

  constructor() { }
  
  isValid(rib: string): boolean {
    if (!rib || rib.length !== 20 || !/^\d+$/.test(rib)) return false;

    const bankCode = rib.substr(0, 2);
    const checkDigits = +rib.substr(18, 2);
    const remainder = 97 - Number(BigInt(rib.substr(0, 18) + '00') % 97n);

    return checkDigits === remainder && this.getBankByCode(bankCode) !== undefined;
  }

  getBankName(rib: string): string {
    const bankCode = rib.substr(0, 2);
    const bank = this.getBankByCode(bankCode);
    return bank ? bank.name : '';
  }

  private getBankByCode(code: string): { code: string, name: string, bic: string } | undefined {
    return RibVerifService.banks.find(bank => bank.code === code);
  }
}