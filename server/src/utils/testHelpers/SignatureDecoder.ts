import * as ethers from 'ethers';

export class SignatureDecoder {

    public decrypt = (transaction: any) => {
        const bla = Buffer.from(
            ethers.utils
                .solidityKeccak256(
                    ['bytes', 'bytes', 'bytes', 'uint256', 'address', 'uint256'],
                    [
                        Buffer.from(transaction.callback, 'utf8'),
                        Buffer.from(transaction.description, 'utf8'),
                        Buffer.from(transaction.name, 'utf8'),
                        transaction.networkID,
                        transaction.to,
                        transaction.value
                    ]
                )
                .substr(2),
            'hex'
        );
        const digest = ethers.utils.keccak256(Buffer.concat([new Buffer('\x19Ethereum Signed Message:\n'),
        new Buffer(String(bla.length)), bla]));
        const sig = this.extractEcdsaSignature(transaction.signature);
        return ethers.SigningKey.recover(digest, sig.r, sig.s, this.getRecIdFromV(sig.v)).toLowerCase();
    }

    public extractEcdsaSignature = (signature: string) => {
        return <any>{
            r: Buffer.from(signature.slice(2, 66), 'hex'),
            s: Buffer.from(signature.slice(66, 130), 'hex'),
            v: parseInt('0x' + signature.slice(130, 132), 16)
        };
    }

    public getRecIdFromV = (v: number) => {
        let header = v;
        if ((header < 27) || (header > 34)) {
            return header;
        }
        if (header >= 31) {
            header -= 4;
        }
        return header - 27;
    }
}