# Sendgrid email action
Send emails using Sendgrid.

## Usage
Sendgrid `dynamic_template_data` can be passed using the `dynamic_template_data` input. The input should be a multiline string with each line containing a key that is used in the template. The value of the key is taken from the environment variables with the same name.

```yaml
- name: Send sendgrid email
  uses: Vendic/sendgrid-action@v1
  env:
    name: 'John Doe'
    email: 'john@doe.com'
    message: 'Hello world!'
  with:
    sendgrid_api_key: ${{ secrets.SENDGRID_API_KEY }}
    from: 'from@email.com'
    to: 'to@email.com'
    template-id: 'd-1234567890'
    dynamic_template_data: |
      name
      email
      message
```
