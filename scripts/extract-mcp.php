<?php
/**
 * Prints the FluentAffiliate MCP tool definitions and server instructions as JSON.
 *
 * Called by generate-docs.mjs, once with --pro and once without, so the generator
 * can mark the input fields that only exist when FluentAffiliate Pro is active.
 * Runs without WordPress: the few WordPress functions the definitions touch are
 * stubbed to return their defaults, and only plugin classes are autoloaded.
 *
 * Usage: php extract-mcp.php <fluent-affiliate plugin root> [--pro]
 */

$pluginRoot = rtrim($argv[1] ?? '', '/');
if (!$pluginRoot || !is_file($pluginRoot . '/app/Modules/MCP/AbilitiesRegistrar.php')) {
    fwrite(STDERR, "MCP module not found under {$pluginRoot}\n");
    exit(2);
}

define('ABSPATH', __DIR__ . '/');
define('MINUTE_IN_SECONDS', 60);
if (in_array('--pro', $argv, true)) {
    define('FLUENT_AFFILIATE_PRO', true);
}

// Filters return their default value: the docs describe a stock site.
function apply_filters($hook, $value) { return $value; }
function do_action() {}
function add_filter() {}
function add_action() {}
function has_filter() { return false; }
function __($text) { return $text; }
function esc_html__($text) { return $text; }

$prefixes = [
    'FluentAffiliate\\App\\'       => $pluginRoot . '/app/',
    'FluentAffiliate\\Framework\\' => $pluginRoot . '/vendor/wpfluent/framework/src/WPFluent/',
];
spl_autoload_register(function ($class) use ($prefixes) {
    foreach ($prefixes as $prefix => $dir) {
        if (strpos($class, $prefix) === 0) {
            $file = $dir . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
            if (is_file($file)) {
                require $file;
            }
            return;
        }
    }
});

use FluentAffiliate\App\Modules\MCP\AbilitiesRegistrar;
use FluentAffiliate\App\Modules\MCP\MCPInit;

$tools = [];
foreach (AbilitiesRegistrar::getDefinitions() as $name => $definition) {
    $callback = $definition['execute_callback'];
    $tools[$name] = [
        'label'        => $definition['label'],
        'description'  => $definition['description'],
        'input_schema' => $definition['input_schema'],
        'annotations'  => $definition['annotations'],
        'requires'     => $definition['requires'],
        'pro'          => !empty($definition['pro']),
        'callback'     => is_array($callback) ? substr(strrchr('\\' . $callback[0], '\\'), 1) . '::' . $callback[1] : '',
    ];
}

echo json_encode([
    'server_id'    => MCPInit::SERVER_ID,
    'route'        => MCPInit::ROUTE,
    'instructions' => MCPInit::serverInstructions(),
    'tools'        => $tools,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
