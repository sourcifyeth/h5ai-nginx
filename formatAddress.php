<?php

include_once("./Kekkak.php");

use kornrunner\Keccak;

function formatAddress($addr)
{
    $address = strtolower($addr);
    $addressWithout0x = substr($address, 2);
    $chars = str_split($addressWithout0x, 1);
    $hashed = str_split(Keccak::hash($addressWithout0x, 256), 2);
    for ($i = 0; $i < 40; $i += 2) {
        if (hexdec($hashed[$i >> 1]) >> 4 >= 8) {
            $chars[$i] = strtoupper($chars[$i]);
        }

        if ((hexdec($hashed[$i >> 1]) & 0x0f) >= 8) {
            $chars[$i + 1] = strtoupper($chars[$i + 1]);
        }
    }
    return "0x" . join($chars);
}

$pathParts = explode("/", $_SERVER['REQUEST_URI']);

$finalPath = '';
// loop on each part of url path
foreach ($pathParts as $pathPart) {
    $part = $pathPart;

    $matches = null;

    // if the part is an address
    preg_match('/0x([A-Fa-f0-9]{40})/i', $part, $matches);
    if (count($matches) > 0) {
        // format the address
        $part = formatAddress($part);
    }
    $finalPath .= $part . "/";
}
// remove last "/"
$finalPath = rtrim($finalPath, "/");

// compare the two path, the one received and the one after formatting the address
if (
    count(array_diff($pathParts, explode("/", $finalPath))) === 0
) {
    // if they have no difference continue
    include('./index.php');
} else {
    // otherwise redirect to the right address
    header("Location: http://$_SERVER[HTTP_HOST]$finalPath");
    exit();
}
