# My Submission For the Shopify Developer Intern Challenge

I present to you: **ImgVault**, an application that allows you to store your images on the cloud and save valuable space on your phone/computer. You can also share your images to your socials or other applications!

![ImgVault Meme]()

I wanted to challenge myself here and build a cross-platform solution using React-Native and Expo to build out the application. I used Firebase to store images and authenticate users. The application works for iOS, Android and the Web.

I'm super thankful for the opportunity, as I've definitely learned quite a lot from building this application!

## Why Did I Make This?

For my application to the *Backend Developer Intern* and the *Infrastructure / Site Reliability Engineering Intern* position at Shopify,
I was asked to implement an image repository with minimal restrictions on what we could do. There were a few recommended features that were suggested in the problem statement which I used to help me build out this application.

For a more thorough explanation of the problem: [Problem Statement Documentation](https://docs.google.com/document/d/1ZKRywXQLZWOqVOHC4JkF3LqdpO3Llpfk_CkZPR8bjak/edit)

## Screenshots!
TODO: insert screenshots

## Implementation
### Overview

I focused on implementing a few things in my application, including components of **ADD** and **DELETE** from the problem statement. Here's what I've implemented altogether.

#### Uploading
- Upload images from their photo gallery on device to ImgVault (storing the images in Firebase)
- Take pictures from the camera and upload them immediately to ImgVault (storing the pictures in Firebase)
- Allow the user to upload many photos at one time.
- Allow the user to preview all images that they want to upload before the process kicks off.
- Allow the user to clear the images and choose other images that they wish to upload instead.

#### Viewing
- Allow the user to view their images that are stored on ImgVault. (Pulling this information from Firebase)
- Press on an image and view more details about an image and provide actions that the user can do with the image.
- View account details, which provides simple info about your app, device, and account along with an explanation how the application functions.

#### Downloading
- Download an image from ImgVault when desired (Using the download url provided by Firebase to download the image and store the image in local storage)

#### Sharing
- Use built-in sharing features of the device to share to as much applications as possible, improving the sharing experience for the user.
- The images are private by default and are seen by no one but the user, sharing allows users to make these images public to whomever they wish.

#### Deleting
- Provide the user the ability to delete an image completely from ImgVault (Removing its instance on Firebase)

#### Firebase
- Use Firebase Authentication to create and log users in securely
- Use Firebase Storage to store the images
- Use Firebase Firestore for my database

#### User Experience
- Make sure the user is not confused with the state of the application
  - Provide spinners to indicate uploading or loading images
  - Provide alerts to signify the completion of processes
- Provide a clean and uncluttered UI so that user can quickly pick up how the application works.
- Provide an overview of the application to allow user to learn how the application works.

## Learning Experience

### Challenges

By going with Expo (Managed Workflow), I stumbled into a few issues. Expo didn't:
- provide an interface to use the device's multi image picker
- provide access to the device's actual storage
  - The storage that Expo provides you access to is hard to reach by any file viewers and images stored there will not be seen by the user
  - The workaround of adding images to the media library of the device always returned a rejected promise for iOS even if I had satisfied all requirements needed to add an image there. This is a bug on Expo's end.

I have commented thoroughly about this and my workarounds to these issues.

In theory, I could eject from a managed workflow and make the application with just react-native, writing native code when I need to, to take full advantage of the device but this would slow my laptop tremendously (Xcode itself takes 10-15 minutes to open... + Android Studio + iOS simulator + android emulator + browser ... you can see what I mean) it would make my macbook a fantastic heater though. Time was of essence here and I wanted to submit something polished as opposed to not being able to submit something on time.

### Positives

Expo is a great tool to use to simplify the cross-platform development process. It handles the set up for you, so you can focus on the application itself. Because of that, I was able to quickly iterate through solutions on my phone and get immediate feedback with hot reloading as opposed to having to build the application every time I made a change, rapidly tweaking the application until it satisfied the requirements. 

It's understandable for Expo to not cover all use cases. Cross-platform really broadens the amount of devices one has to develop for and some solutions are impossible to implement for all, you'll need to build it on a case by case basis.

### Next Steps

I want to dive into using react-native solely and see how different the workflow is by trying to implement some of the things I had issues with. Here's hoping my laptop doesn't go up in flames.
