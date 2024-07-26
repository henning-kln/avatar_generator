# Avatar Generator

This repository contains the code for an avatar generator API. The API can be accessed at [avatar.hk-labs.de](https://avatar.hk-labs.de).

## Usage

To generate an avatar, make a GET request to the following endpoint:

```
GET /api/avatar
```

The API supports the following query parameters:

- `name`: The username of the user. This parameter is used to generate a unique profile picture for each user.

Example usage:

```
GET /api/avatar?name=henning-kln
```

This will generate an avatar 

## Development

To set up the project locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/henning-kln/avatar-generator.git
```

2. Install the dependencies:

```
npm install
```

3. Start the development server:

```
npm run start
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
