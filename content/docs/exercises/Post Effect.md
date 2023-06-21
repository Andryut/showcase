# Posteffects
>**Prompt:** Implement some posteffects you find interesting.

Posteffects are, in the simplest way, effects thhat are applied to an image after it has been rendered. This effects can range from simple xoom lenses to kaleidoscopes or fish eye lenses like the one I implemented for this excercise.

## Fish Eye Lens effect

The fish eye lens effect refers to a distinctive visual distortion created by a special type of camera lens known as a fish eye lens. This lens has an extremely wide-angle field of view, often reaching up to 180 degrees or more. It captures a significantly broader perspective than a standard lens, resulting in a unique and exaggerated distortion.

The primary characteristic of the fish eye lens effect is the significant curvature and barrel distortion it introduces to the captured image. Straight lines near the edges of the frame appear to curve outward, creating a convex shape. This distortion gives the impression of a rounded or "fish eye" view, hence the name.

Fish eye lenses can be categorized into two main types: circular fish eye (lik the one repoduced in this exercise) and full-frame fish eye. Circular fish eye lenses produce a fully circular image within the camera's frame, while full-frame fish eye lenses capture a broader field of view that fills the entire frame.

![10 Tips for Shooting with a Circular Fisheye Lens | Shutterbug](https://www.shutterbug.com/images/styles/600_wide/public/M%20Teaser.jpg)
>Example of a circular fish eye lens.

## How was the effect achieved

To achieve this effect in the p5.js implementation I first loaded the  pixels of the image through the **loadPixels()** function into the **pixels** array and to properly load all the pixels of the image i used a loop to iterate over the whole image. 

Each loaded pixel has a **y** and **x** coordinates that are used to locate the pixels in the image. The **dx** and **dy** are calculated by substracting the mouse´s x and y positions from the current pixel´s coordinates. These variables represent the distances between the current pixel and the mouse position.

The final distance is calculated using the Euclidean distance formula of ***sqrt(dx * dx + dy * dy)*** . This helps us find the distance between the pixel and the lens radius, and if this distance is less than the lens radius it means that the current pixel falls within the lens´s boundaries, thus the fish eye lens effect is applied.

Now that we know when a pixel is within the lens´s boundaries, the effect needs to be applied. The first step to do so is to calculate the normalized distance **r** from the mouse position to the current pixel eithin the lens area, this is achieved by calculating ***distance/lensRadius***. After this is necessary to calculate the angle from the mouse position to the pixel, this is done useing ***atan2(dy, dx)*** and it´s value is asingned to the variable **theta**.

Then, the distorition is calculated using the **xDistroted** and **yDistorited** variables. They use the ***(r * r * lensRadius * distortionFactor) * cos(theta)*** and ***(r * r * lensRadius * distortionFactor) * sin(theta)*** formulas respectively.

Finnaly, the **indexDistorted** variable is calculated to determine the indezx of the distorted pixel in the **pixels** array. This index is used to retrieve the color values of the distorted pixel, and these values are copied to the current pixel in the **pixels** array. After all of that, the **updatePixels()** function is calle to update the display window with the modified **pixels** array.

{{< p5-iframe sketch="/showcase/sketches/exercises/post_effect/post_effect.js" width="600" height="600" >}}