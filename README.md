# CGUs

**Services** have **terms** that can change over time. _CGUs_ enables users rights advocates, regulatory bodies and any interested citizen to follow the **changes** to these **terms** by being **notified** whenever a new **version** is published, and exploring their entire **history**.

> Les services ont des conditions générales qui évoluent dans le temps. _CGUs_ permet aux défenseurs des droits des utilisateurs, aux régulateurs et à toute personne intéressée de suivre les évolutions de ces conditions générales en étant notifiée à chaque publication d'une nouvelle version, et en explorant leur historique.


## How it works

**Services** are **declared** within _CGUs_ with a **declaration file** listing all the **documents** that, together, constitute the **terms** under which this **service** can be used. These **documents** all have a **type**, such as “terms and conditions”, “privacy policy”, “developer agreement”…
In order to **track** their **changes**, **documents** are periodically obtained by **fetching** a web **location** and **selecting content** within the **web page** to remove the **noise** (ads, navigation menu, login fields…).
Beyond selecting a subset of a page, some **documents** have additional **noise** (hashes in links, CSRF tokens…) that would be false positives for **changes**. _CGUs_ thus supports specific **filters** for each **document**.
However, the shape of that **noise** can change over time. In order to recover in case of information loss during the **noise filtering** step, a **snapshot** is **recorded** every time there is a **change**.
After the **noise** is **filtered out** from the **snapshot**, if there are **changes** in the resulting **document**, a new **version** of the **document** is **recorded**.
Anyone can run their own **private** instance and track changes on their own. However, we also **publish** each **version** on a **public** instance that makes it easy to explore the entire **history** and enables **notifying** over email whenever a new **version** is **recorded**.
Users can **subscribe** to **notifications** through a web interface.


## Installing

This module is built with [Node](https://nodejs.org/en/). You will need to [install Node](https://nodejs.org/en/download/) to run it.

Clone the repository and install dependencies:

```sh
git clone https://github.com/ambanum/CGUs.git
cd CGUs
npm install
```

## Setting up the database

Initialize the database:
```sh
npm run setup
```

## Configuration

The default configuration can be read and changed in `config/default.json`:

```json
{
  "serviceProvidersPath": "Directory containing providers definition and associated sanitizers.",
  "history": {
    "dataPath": "Database directory path, relative to the root of this project",
    "authoritative": "Boolean. Set to true to push tracked changes to the shared, global database. Should be true only in production.",
    "author": {
      "name": "Name to which changes in tracked documents will be credited",
      "email": "Email to which changes in tracked documents will be credited"
    }
  },
  "notifier": {
    "sendInBlue": {
      "administratorsListId": "SendInBlue contacts list ID of administrators",
      "updatesListId": "SendInBlue contacts list ID of persons to notify on document updates",
      "updateTemplateId": "SendInBlue email template ID used for updates notifications",
      "errorTemplateId": "SendInBlue email template ID used for error notifications",
    }
  }
}
```

## Usage

To get the latest versions of all service providers' terms:

```
npm start
```

The latest version of a document will be available in `/data/sanitized/$service_provider_name/$document_type.md`.

To hourly update documents:

```
npm run start:scheduler
```


## Adding a service provider

In the folder `providers`, create a JSON file with the name of the service provider you want to add, with the following structure:

```json
{
  "serviceProviderName": "<the public name of the service provider>",
  "documents": {
    "<document type>": {
      "url": "<the URL where the document can be found>",
      "contentSelector": "<a CSS selector that targets the meaningful part of the document, excluding elements such as headers, footers and navigation>",
    }
  }
}
```

For the `<document type>` key, you will have to use one of those listed in `/src/documents_types.js` (or create a new one there if it is not already referenced).
You can find examples in the `providers` folder.

## Deploying

See [Ops Readme](ops/README.md).

- - -

## License

The code for this software is distributed under the European Union Public Licence (EUPL) v1.2.
Contact the author if you have any specific need or question regarding licensing.

