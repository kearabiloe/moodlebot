# moodlebot

## Development
### Pre-deployment steps
#### Generating New Key
```
openssl genpkey -algorithm RSA -out private.pem -aes256

openssl pkcs8 -topk8 -inform PEM -outform PEM -in private.pem -out private_pkcs8.pem -nocrypt

openssl rsa -in private_pkcs8.pem -pubout -outform PEM -out public.pem
```
#### Sign extension
```
openssl sha1 -sha1 -binary -sign private_pkcs8.pem -out signature extension.crx 
```

